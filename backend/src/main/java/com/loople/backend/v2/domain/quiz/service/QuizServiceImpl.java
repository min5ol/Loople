/*
    작성일자: 2025-07-16
    작성자: 백진선
    설명: 퀴즈 문제 및 사용자 답안 관련 비즈니스 로직을 퍼리하는 서비스 구현체
*/
package com.loople.backend.v2.domain.quiz.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loople.backend.v2.domain.quiz.dto.*;
import com.loople.backend.v2.domain.quiz.entity.MultipleOption;
import com.loople.backend.v2.domain.quiz.entity.Problem;
import com.loople.backend.v2.domain.quiz.entity.UserAnswer;
import com.loople.backend.v2.domain.quiz.repository.MultipleOptionRepository;
import com.loople.backend.v2.domain.quiz.repository.ProblemRepository;
import com.loople.backend.v2.domain.quiz.repository.UserAnswerRepository;
import com.loople.backend.v2.domain.users.dto.UpdatedUserPointRequest;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import com.loople.backend.v2.global.exception.CustomException;
import com.loople.backend.v2.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final ProblemRepository problemRepository;  //문제 엔티티 DB 접근용 Repository
    private final MultipleOptionRepository multipleOptionRepository;    //문제 옵션 엔티티 DB 접근용 Repository
    private final UserAnswerRepository userAnswerRepository;    //사용자 답안 엔티티 DB 접근용 Repository
    private final UserRepository userRepository;    //사용자 엔티티 DB 접근용 Repository

    //OpenAPI로부터 받은 문제 데이터를 파싱 및 저장
    @Override
    public void saveProblem(String response) {
        //response: ```json
        //[
        //  {
        //    "type": "OX",
        //    "question": "플라스틱 용기는 항상 물로 깨끗하게 씻은 후 분리배출해야 한다.",
        //    "options": null,
        //    "answer": "O"
        //  },
        //  {
        //    "type": "MULTIPLE",
        //    "question": "다음 중 재활용이 불가능한 것은 무엇일까요?",
        //    "options": [
        //      {
        //        "content": "오염된 피자 상자",
        //        "optionOrder": 1
        //      },
        //      {
        //        "content": "깨끗한 유리병",
        //        "optionOrder": 2
        //      },
        //      {
        //        "content": "깨끗한 플라스틱 병",
        //        "optionOrder": 3
        //      },
        //      {
        //        "content": "신문지",
        //        "optionOrder": 4
        //      }
        //    ],
        //    "answer": "A"
        //  }
        //]
        //```

        String cleanedResponse = response
                .replaceAll("^```json\\s*", "")  // 시작 부분의 ```json 제거
                .replaceAll("```$", "");          // 끝 부분의 ``` 제거
        System.out.println("cleanedResponse = " + cleanedResponse);

        ObjectMapper mapper = new ObjectMapper();

        List<ProblemRequestDto> extracted = extracted(cleanedResponse, mapper);

        extracted.forEach(problem -> {
            Problem build = Problem.builder()
                    .question(problem.getQuestion())
                    .type(problem.getType())
                    .answer(problem.getAnswer())
                    .build();
            problemRepository.save(build);

            if (problem.getOptions() != null) {
                problem.getOptions().forEach(option -> {
                    MultipleOption buildOption = MultipleOption.builder()
                            .problem(build)
                            .content(option.getContent())
                            .optionOrder(option.getOptionOrder())
                            .build();
                    multipleOptionRepository.save(buildOption);
                });
            }
        });
    }

    private List<ProblemRequestDto> extracted(String response, ObjectMapper mapper) {
        try {
            return mapper.readValue(response, new TypeReference<List<ProblemRequestDto>>() {
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    //사용자 답안 저장 및 정답 여부, 점수 계산
    @Transactional
    @Override
    public UserAnswerResponseDto saveUserAnswer(UserAnswerRequestDto userAnswerRequestDto, Long userId) {
        LocalDate today = LocalDate.now();

        User user = findById(userId);

        boolean isCorrect = checkTheAnswer(userAnswerRequestDto);

        boolean isWeekly = false;
        boolean isMonthly = false;

        if (today.getDayOfWeek() == DayOfWeek.SUNDAY && hasCheckedAttendanceForAWeek(userId)) {
            isWeekly = true;
        }

        if (hasCheckedAttendanceForAMonth(userId)) {
            isMonthly = true;
        }

        int totalPoints = (isCorrect ? 7 : 3) + (isWeekly ? 20 : 0) + (isMonthly ? 100 : 0);

        updatedUserPoints(totalPoints, user);

        UserAnswer userAnswer = UserAnswer.builder()
                .userId(userId)
                .userEmail(user.getEmail())
                .problemId(userAnswerRequestDto.getProblemId())
                .submittedAnswer(userAnswerRequestDto.getSubmittedAnswer())
                .isCorrect(isCorrect ? 1 : 0)
                .isWeekly(isWeekly ? 1 : 0)
                .isMonthly(isMonthly ? 1 : 0)
                .points(totalPoints)
                .solvedAt(today)
                .build();

        userAnswerRepository.save(userAnswer);

        return new UserAnswerResponseDto(
                userAnswer.getIsCorrect(),
                userAnswer.getIsWeekly(),
                userAnswer.getIsMonthly(),
                totalPoints
        );
    }

    private void updatedUserPoints(int delta, User user) {
        int newPoints = user.getPoints() + delta;
        if (newPoints < 0) newPoints = 0;
        user.addPoints(newPoints);
    }

    //오늘 문제 풀이 여부 반환
    @Override
    public boolean hasSolvedTodayProblem(Long userId) {
        //현재 로그인된 사용자가 오늘 문제를 푼 기록이 있는지 조회
        Optional<UserAnswer> byUserIdAndSolvedDate = userAnswerRepository.findByUserIdAndSolvedAt(userId, LocalDate.now());

        return byUserIdAndSolvedDate.isPresent();
    }

    @Override
    public List<Integer> fetchAttendanceStatus(Long userId) {
        DateRange thisMonthInfo = getThisMonthInfo();

        List<UserAnswer> byUserId = userAnswerRepository.findByUserIdAndSolvedAtBetween(userId, thisMonthInfo.getStart(), thisMonthInfo.getEnd());

        List<Integer> attendanceDays = new ArrayList<>();
        for (UserAnswer userAnswer : byUserId) {
            int day = userAnswer.getSolvedAt().getDayOfMonth();
            attendanceDays.add(day);
        }

        return attendanceDays;
    }

    @Override
    public ProblemResponseDto getProblem(Long userId) {
        Random random = new Random();

        if (hasSolvedTodayProblem(userId)) {
            return new ProblemResponseDto(null, null, null, null, true);
        } else {
            //전체 말고 안 푼 문제 리스트(푼 문제? 안 푼 문제?)
            List<Problem> allProblem = problemRepository.findAll();
            List<UserAnswer> solvedProblem = userAnswerRepository.findByUserId(userId);

            List<Long> solvedProblemIds = solvedProblem.stream()
                    .map(userAnswer -> userAnswer.getProblemId())
                    .collect(Collectors.toList());

            List<Problem> unsolvedProblems = allProblem.stream()
                    .filter(problem -> !solvedProblemIds.contains(problem.getNo()))
                    .collect(Collectors.toList());

            if (unsolvedProblems.isEmpty()) {
                throw new NoSuchElementException("주어진 문제를 모두 다 풀었습니다.");
            }

            int randomUnsolvedProblem = random.nextInt(unsolvedProblems.size());
            Problem unsolved = unsolvedProblems.get(randomUnsolvedProblem);
            List<MultipleOptionResponseDto> multipleOptionResponseDtos = multipleOptionRepository.findByProblem(unsolved);
            return new ProblemResponseDto(unsolved.getNo(), unsolved.getQuestion(), unsolved.getType(), multipleOptionResponseDtos, false);
        }
    }

    //사용자가 응답한 답안과 문제의 정답과의 일치 여부
    private boolean checkTheAnswer(UserAnswerRequestDto userAnswerRequestDto) {
        return problemRepository.findById(userAnswerRequestDto.getProblemId())
                .map(problem -> problem.getAnswer().equals(userAnswerRequestDto.getSubmittedAnswer()))
                .orElseThrow(() -> new IllegalArgumentException("해당 문제는 존재하지 않습니다."));
    }

    //이번 주에 사용자가 매일 출석했는지 확인
    private boolean hasCheckedAttendanceForAWeek(Long userId) {
        LocalDate today = LocalDate.now();  //2025-07-18
        LocalDate weekAgo = today.minusDays(6); //오늘 포함 7일 -> 2025-07-12

        Long counted = userAnswerRepository.countAttendanceByUserIdAndSolvedAtBetween(userId, weekAgo, today);

        return counted == 6;    //일요일 당일 문제 풀이 제외하고
    }

    //이번 달에 사용자가 매일 출석했는지 확인
    private boolean hasCheckedAttendanceForAMonth(Long userId) {
        DateRange thisMonthInfo = getThisMonthInfo();
        int totalDayOfThisMonth = thisMonthInfo.getEnd().getDayOfMonth();

        Long counted = userAnswerRepository.countAttendanceByUserIdAndSolvedAtBetween(userId, thisMonthInfo.getStart(), thisMonthInfo.getEnd());

        return totalDayOfThisMonth == (counted + 1);
    }

    //이번 달 정보 출력
    private DateRange getThisMonthInfo() {
        LocalDate today = LocalDate.now();  //2025-07-18
        YearMonth thisMonth = YearMonth.from(today);    //2025-07
        LocalDate firstDayOfThisMonth = thisMonth.atDay(1); //2025-07-01
        LocalDate lastDayOfThisMonth = thisMonth.atEndOfMonth();    //2025-07-31

        return new DateRange(firstDayOfThisMonth, lastDayOfThisMonth);
    }

    private User findById(Long userId) {
        return userRepository.findByNo(userId)
                .orElseThrow(() -> new unFindNoException("존재하지 않는 아이디입니다."));

    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)    //예외 발생 시 자동으로 HTTP 상태 코드 401(Unauthorized)로 응답
    public class unFindNoException extends RuntimeException {
        public unFindNoException(String message) {
            super(message); //예외 메시지 부모 클래스(RuntimeException)로 전달
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceInfoResponse getAttendanceInfo(Long userId) {
        List<UserAnswer> allAnswers = userAnswerRepository.findByUserIdOrderBySolvedAtDesc(userId);

        if (allAnswers.isEmpty()) {
            return new AttendanceInfoResponse(0, 0);
        }

        List<LocalDate> uniqueDates = allAnswers.stream()
                .map(UserAnswer::getSolvedAt)
                .distinct()
                .collect(Collectors.toList());

        int consecutiveDays = calculateConsecutiveDays(uniqueDates);

        int monthlyDays = calculateMonthlyDays(uniqueDates);

        return new AttendanceInfoResponse(consecutiveDays, monthlyDays);
    }

    private int calculateConsecutiveDays(List<LocalDate> uniqueDates) {
        if (uniqueDates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate mostRecentDate = uniqueDates.get(0);
        int streak = 0;

        // 가장 최근 기록이 오늘 또는 어제여쟈 연속 출석이 유효
        if (mostRecentDate.equals(today) || mostRecentDate.equals(today.minusDays(1))) {
            streak = 1;
            LocalDate expectedDate = mostRecentDate.minusDays(1);

            for (int i = 1; i < uniqueDates.size(); i++) {
                if (uniqueDates.get(i).equals(expectedDate)) {
                    streak++;
                    expectedDate = expectedDate.minusDays(1);
                } else {
                    break;
                }
            }
        }

        return streak;
    }

    private int calculateMonthlyDays(List<LocalDate> uniqueDates) {
        YearMonth currentMonth = YearMonth.now();
        return (int) uniqueDates.stream()
                .filter(date -> YearMonth.from(date).equals(currentMonth))
                .count();
    }
}


