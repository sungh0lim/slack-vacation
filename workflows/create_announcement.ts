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
          name: "channels",
          title: "채널 선택",
          type: Schema.types.array,
          items: {
            type: Schema.slack.types.channel_id,
          },
        },
        {
          name: "message",
          title: "Message",
          type: Schema.types.string,
          description:
            "Compose your message using plain text, mrkdwn, or blocks",
          long: true,
        },
      ],
      required: ["channels", "message"],
    },
  });

// Step 2: Send announcement(s)
CreateAnnouncementWorkflow.addStep(
  PrepareSendAnnouncementFunctionDefinition,
  {
    message: formStep.outputs.fields.message,
    channels: formStep.outputs.fields.channels,
    username: CreateAnnouncementWorkflow.inputs.created_by,
  },
);

export default CreateAnnouncementWorkflow;
