package com.loople.backend.v2.domain.quiz.service;

import com.loople.backend.v2.domain.quiz.dto.*;
import com.loople.backend.v2.domain.quiz.entity.MultipleOption;
import com.loople.backend.v2.domain.quiz.entity.Problem;
import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import com.loople.backend.v2.domain.quiz.entity.UserAnswer;
import com.loople.backend.v2.domain.quiz.repository.MultipleOptionRepository;
import com.loople.backend.v2.domain.quiz.repository.ProblemRepository;
import com.loople.backend.v2.domain.quiz.repository.UserAnswerRepository;
import com.loople.backend.v2.domain.users.dto.UpdatedUserPointRequest;
import com.loople.backend.v2.domain.users.entity.User;
import com.loople.backend.v2.domain.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService{

    private final ProblemRepository problemRepository;
    private final MultipleOptionRepository multipleOptionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserRepository userRepository;

    @Override
    public ProblemResponseDto saveProblem(String response) {
        ProblemRequestDto problemRequestDto = parseApiResponse(response);
        List<MultipleOptionRequestDto> options = problemRequestDto.getOptions();

        Problem problem = new Problem(problemRequestDto.getQuestion(), problemRequestDto.getType(), problemRequestDto.getAnswer());
        problemRepository.save(problem);
        saveOption(options, problem);

        List<MultipleOptionResponseDto> responseOptions = options.stream()
                .map(opt -> new MultipleOptionResponseDto(opt.getContent(), opt.getOptionOrder()))
                .toList();

        return new ProblemResponseDto(problem.getNo(), problem.getQuestion(), problem.getType(), responseOptions, false);
    }

    @Override
    public void saveOption(List<MultipleOptionRequestDto> options, Problem problem) {
        List<MultipleOption> multipleOptions = new ArrayList<>();
        for(MultipleOptionRequestDto optionDto : options){
            multipleOptions.add(new MultipleOption(problem, optionDto.getContent(), optionDto.getOptionOrder()));
        }
        multipleOptionRepository.saveAll(multipleOptions);
    }

    @Override
    public UserAnswerResponseDto saveUserAnswer(UserAnswerRequestDto userAnswerRequestDto) {
        Long problemId = userAnswerRequestDto.getProblemId();
        String submittedAnswer = userAnswerRequestDto.getSubmittedAnswer();
        Long userId = getLoggedInUserId();
        boolean isCorrect = checkTheAnswer(userAnswerRequestDto);
        boolean isWeekly=false;
        boolean isMonthly = false;

        //주간 출석 체크 - 일요일일 때 한 번에 체크
        if (LocalDate.now().getDayOfWeek() == DayOfWeek.SUNDAY) {
            if(hasCheckedAttendanceForAWeek(userId)){
                isWeekly = true;
            }
        }

        //월간 출석 체크
        if(hasCheckedAttendanceForAMonth(userId)){
            isMonthly = true;
        }

        int totalPoints = (isCorrect?7:3) + (isWeekly?20:0) + (isMonthly?100:0);
        updatedUserPoints(new UpdatedUserPointRequest(userId, totalPoints));

        UserAnswer userAnswer = UserAnswer.builder()
                .userId(userId)
                .problemId(problemId)
                .submittedAnswer(submittedAnswer)
                .isCorrect(isCorrect?1:0)
                .isWeekly(isWeekly?1:0)
                .isMonthly(isMonthly?1:0)
                .points(totalPoints)
                .solvedAt(LocalDate.now())
                .build();

        System.out.println("userAnswer = " + userAnswer);
        userAnswerRepository.save(userAnswer);

        return new UserAnswerResponseDto(userAnswer.getIsCorrect(), userAnswer.getIsWeekly(), userAnswer.getIsMonthly(), totalPoints);

    }

    @Override
    public boolean hasSolvedTodayProblem() {
        Long userId = getLoggedInUserId();
        Optional<UserAnswer> byUserIdAndSolvedDate = userAnswerRepository.findByUserIdAndSolvedAt(userId, LocalDate.now());

        if(byUserIdAndSolvedDate.isPresent()){
            return true;
        }
        return false;
    }

    //db 저장용 파싱
    private ProblemRequestDto parseApiResponse(String response) {
        //response: "type: OX\nquestion: 순환 경제는 물건을 오래 쓰고, 다시 쓰는 것을 중요하게 생각한다.\nanswer: O"
        // 응답을 줄 단위로 분리
        String[] lines = response.split("\n");

        // 파싱할 변수 초기화
        String type = null;
        String question = null;
        String answer = null;
        List<MultipleOptionRequestDto> options = new ArrayList<>();

        // 각 줄을 순회하면서 필요한 데이터 추출
        for (int i=0;i<lines.length;i++) {
            String line = lines[i].trim();  // 앞뒤 공백 제거

            if (line.startsWith("type:")) {
                // "type:"으로 시작하는 줄에서 문제 유형 추출
                type = line.substring("type:".length()).trim();

            } else if (line.startsWith("question:")) {
                // "question:"으로 시작하는 줄에서 문제 내용 추출
                question = line.substring("question:".length()).trim();

            } else if (line.startsWith("answer:")) {
                // "answer:"으로 시작하는 줄에서 정답 추출
                answer = line.substring("answer:".length()).trim();

            } else if (line.startsWith("options:")) {
                // "options:"으로 시작하면 다음 4줄(옵션 A~D)을 읽어옴
                for (int j = 1; j <= 4 && i + j < lines.length; j++) {
                    String optLine = lines[i + j].trim();

                    // 각 옵션 라인이 "A. ", "B. " 등 형식에 맞는지 검사
                    if (optLine.matches("^[A-D]\\.\\s.*")) {
                        // 옵션 라벨 (A, B, C, D)
                        int label = convertLabelToNumber(optLine.substring(0, 1));

                        // 옵션 내용 (라벨 뒤의 텍스트)
                        String content = optLine.substring(3).trim();

                        // 옵션 리스트에 추가
                        options.add(new MultipleOptionRequestDto(content, label));
                    }
                }
            }
        }

        return new ProblemRequestDto(question, ProblemType.valueOf(type), answer, options);
    }

    private int convertLabelToNumber(String label) {
        switch (label.toUpperCase()) {
            case "A": return 1;
            case "B": return 2;
            case "C": return 3;
            case "D": return 4;
            default: throw new IllegalArgumentException("Invalid label: " + label);
        }
    }

    private Long getLoggedInUserId(){
        //추후 수정 예정
        return 4L;
    }

    private boolean checkTheAnswer(UserAnswerRequestDto userAnswerRequestDto){
        return problemRepository.findById(userAnswerRequestDto.getProblemId())
                .map(problem -> problem.getAnswer().equals(userAnswerRequestDto.getSubmittedAnswer()))
                .orElseThrow(() -> new IllegalArgumentException("해당 문제는 존재하지 않습니다."));
    }

    private boolean hasCheckedAttendanceForAWeek(Long userId){
        LocalDate today = LocalDate.now();  //2025-07-18
        LocalDate weekAgo = today.minusDays(6); //오늘 포함 7일 -> 2025-07-12

        Long counted = userAnswerRepository.countAttendanceByUserIdAndSolvedAtBetween(userId, weekAgo, today);

        return counted == 7;
    }

    private boolean hasCheckedAttendanceForAMonth(Long userId){
        LocalDate today = LocalDate.now();  //2025-07-18
        YearMonth thisMonth = YearMonth.from(today);    //2025-07
        LocalDate firstDayOfThisMonth = thisMonth.atDay(1); //2025-07-01
        LocalDate lastDayOfThisMonth = thisMonth.atEndOfMonth();    //2025-07-31
        int totalDayOfThisMonth = lastDayOfThisMonth.getDayOfMonth();

        Long counted = userAnswerRepository.countAttendanceByUserIdAndSolvedAtBetween(userId, firstDayOfThisMonth, lastDayOfThisMonth);

        return totalDayOfThisMonth == counted;
    }

    private void updatedUserPoints(UpdatedUserPointRequest request){
        Long userId = getLoggedInUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        user.addPoints(request.getPoints());
    }

}


