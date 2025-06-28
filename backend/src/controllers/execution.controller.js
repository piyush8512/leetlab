import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({
        error: "Unauthenticated User",
      });
    }

    // validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "Invalid or missing test cases",
      });
    }

    // prepare each test case for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // send this batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log("Result----------");
    console.log(results);

    // analyze testcase results
    let allPassed = true;
    const detailedResults = results.map((res, index) => {
      const stdout = res.stdout?.trim();
      const expectedOutput = expected_outputs[index];
      const passed = stdout === expectedOutput;

      if (!passed) allPassed = false;

      return {
        testCase: index + 1,
        passed,
        stdout,
        stdin: stdin[index],
        status: res.status.description,
        memory: res.memory ? `${res.memory} KB` : undefined,
        time: res.time ? `${res.time} s` : undefined,
        expected: expectedOutput,
        compile_output: res.compile_output || null,
        stderr: res.stderr || null,
      };
    });

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // if all test cases passed, mark problem solved
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // save individual test case results
    const testCaseResults = detailedResults.map((res) => ({
      submissionId: submission.id,
      testCase: res.testCase,
      passed: res.passed,
      stdout: res.stdout,
      stdin: res.stdin,
      stderr: res.stderr,
      compileOutput: res.compile_output,
      status: res.status,
      memory: res.memory,
      time: res.time,
      expected: res.expected,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      message: "Code executed successfully",
      success: true,
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error while executing code",
    });
  }
};