package com.loople.backend.v2.domain.quiz.service;

import com.loople.backend.v2.domain.quiz.dto.MultipleOptionRequestDto;
import com.loople.backend.v2.domain.quiz.dto.MultipleOptionResponseDto;
import com.loople.backend.v2.domain.quiz.dto.ProblemRequestDto;
import com.loople.backend.v2.domain.quiz.dto.ProblemResponseDto;
import com.loople.backend.v2.domain.quiz.entity.MultipleOption;
import com.loople.backend.v2.domain.quiz.entity.Problem;
import com.loople.backend.v2.domain.quiz.entity.ProblemType;
import com.loople.backend.v2.domain.quiz.repository.MultipleOptionRepository;
import com.loople.backend.v2.domain.quiz.repository.ProblemRepository;
import com.loople.backend.v2.global.api.OpenApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService{

    private final OpenApiClient openApiClient;
    private final ProblemRepository problemRepository;
    private final MultipleOptionRepository multipleOptionRepository;

    @Override
    public ProblemResponseDto saveProblem(String response) {
        ProblemRequestDto problemRequestDto = parseGptResponse(response);
        List<MultipleOptionRequestDto> options = problemRequestDto.getOptions();

        Problem problem = new Problem(problemRequestDto.getQuestion(), problemRequestDto.getType(), problemRequestDto.getAnswer());
        problemRepository.save(problem);
        saveOption(options, problem);

        List<MultipleOptionResponseDto> responseOptions = options.stream()
                .map(opt -> new MultipleOptionResponseDto(opt.getContent(), opt.getOptionOrder()))
                .toList();

        return new ProblemResponseDto(problem.getQuestion(), problem.getType(), responseOptions);
    }

    @Override
    public void saveOption(List<MultipleOptionRequestDto> options, Problem problem) {
        List<MultipleOption> multipleOptions = new ArrayList<>();
        for(MultipleOptionRequestDto optionDto : options){
            multipleOptions.add(new MultipleOption(problem, optionDto.getContent(), optionDto.getOptionOrder()));
        }
        multipleOptionRepository.saveAll(multipleOptions);
    }

    //db 저장용 파싱
    private ProblemRequestDto parseGptResponse(String response) {
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

}
