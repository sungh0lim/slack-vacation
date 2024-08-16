import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { PrepareSendAnnouncementFunctionDefinition } from "../functions/send_announcement/definition.ts";

/**
 * A workflow is a set of steps that are executed in order
 * Each step in a workflow is a function.
 * https://api.slack.com/automation/workflows
 *
 * This workflow uses interactivity. Learn more at:
 * https://api.slack.com/automation/forms#add-interactivity
 */
const CreateAnnouncementWorkflow = DefineWorkflow({
  callback_id: "create_announcement",
  title: "휴가공유v2",
  description: "당신의 휴가를 공유하세요.",
  input_parameters: {
    properties: {
      created_by: {
        type: Schema.slack.types.user_id,
      },
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["created_by", "interactivity"],
  },
});

// Step 1: Open a form to create an announcement using built-in function, OpenForm
// For more on built-in functions
// https://api.slack.com/automation/functions#built-in-functions
const formStep = CreateAnnouncementWorkflow
  .addStep(Schema.slack.functions.OpenForm, {
    title: "휴가공유 입력 폼",
    description:
      "시프티, 기안에는 반영되지 않아요. 앞으로 기능을 지원할 예정입니다.",
    interactivity: CreateAnnouncementWorkflow.inputs.interactivity,
    submit_label: "공유하기",
    fields: {
      elements: [
        {
          name: "holiday_date",
          title: "휴가 일자를 적어주세요.",
          type: Schema.types.string,
          description: "ex. 2024.11.17 ~ 2024.11.20.",
        },
        {
          name: "holiday_type",
          title: "휴가 종류를 선택해주세요.",
          type: Schema.types.string,
          enum: [
            "연차 (8h, 1일)",
            "연차_오전반차 (4h, 0.5일)",
            "연차_오후반차 (4h, 0.5일)",
            "대체휴가 (8h, 1일)",
            "대체_오전반차 (4h, 0.5일)",
            "대체_오후반차 (4h, 0.5일)",
            "휴일근로 대체 (8h, 1일)",
            "휴일근로 대체_오전반차 (4h, 0.5일)",
            "휴일근로 대체_오후반차 (4h, 0.5일)",
            "무급휴가 (8h, 1일)",
            "무급_오전반차 (4h, 0.5일)",
            "무급_오후반차 (4h, 0.5일)",
            "보상휴가 (8h, 1일)",
            "보상_오전반차 (4h, 0.5일)",
            "보상_오후반차 (4h, 0.5일)",
            "특별휴가 (8h, 1일)",
            "특별_오전반차 (4h, 0.5일)",
            "특별_오후반차 (4h, 0.5일)",
            "안식휴가 (8h, 1일)",
            "공가 (8h, 1일)",
            "공가_오전반차 (4h, 0.5일)",
            "공가_오후반차 (4h, 0.5일)",
            "병가 (8h, 1일)",
            "경조휴가 (8h, 1일)",
            "출산휴가 (8h, 1일)",
          ],
        },
        {
          name: "message",
          title: "추가로 공유할 내용이 있다면 적어주세요.",
          type: Schema.types.string,
          long: true,
        },
        {
          name: "channels",
          title: "공유할 채널을 선택해주세요. (복수선택 가능)",
          type: Schema.types.array,
          items: {
            type: Schema.slack.types.channel_id,
          },
        },
      ],
      required: ["holiday_date", "holiday_type", "channels"],
    },
  });

// Step 2: Send announcement(s)
CreateAnnouncementWorkflow.addStep(
  PrepareSendAnnouncementFunctionDefinition,
  {
    holiday_date: formStep.outputs.fields.holiday_date,
    holiday_type: formStep.outputs.fields.holiday_type,
    message: formStep.outputs.fields.message,
    channels: formStep.outputs.fields.channels,
    username: CreateAnnouncementWorkflow.inputs.created_by,
  },
);

export default CreateAnnouncementWorkflow;
