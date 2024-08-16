import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateDraftFunctionDefinition } from "../functions/create_draft/definition.ts";
import { PostSummaryFunctionDefinition } from "../functions/post_summary/definition.ts";
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
    submit_label: "Preview",
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
        {
          name: "channel",
          title: "Draft channel",
          type: Schema.slack.types.channel_id,
          description:
            "The channel where you and your team can preview & edit the announcement before sending",
        },
        {
          name: "icon",
          title: "Custom emoji icon",
          type: Schema.types.string,
          description:
            "Emoji to override the default app icon. Must use the format &colon;robot_face&colon; to be applied correctly.",
        },
        {
          name: "username",
          title: "Custom username",
          type: Schema.types.string,
          description: "Name to override the default app name",
        },
      ],
      required: ["channels", "message", "channel"],
    },
  });

// Step 2: Create a draft announcement
// This step uses a custom function published by this app
// https://api.slack.com/automation/functions/custom
const draftStep = CreateAnnouncementWorkflow.addStep(
  CreateDraftFunctionDefinition,
  {
    created_by: CreateAnnouncementWorkflow.inputs.created_by,
    message: formStep.outputs.fields.message,
    channels: formStep.outputs.fields.channels,
    channel: formStep.outputs.fields.channel,
    icon: formStep.outputs.fields.icon,
    username: formStep.outputs.fields.username,
  },
);

// Step 3: Send announcement(s)
const sendStep = CreateAnnouncementWorkflow.addStep(
  PrepareSendAnnouncementFunctionDefinition,
  {
    message: draftStep.outputs.message,
    channels: formStep.outputs.fields.channels,
    icon: formStep.outputs.fields.icon,
    username: formStep.outputs.fields.username,
    draft_id: draftStep.outputs.draft_id,
  },
);

// Step 4: Post message summary of announcement
CreateAnnouncementWorkflow.addStep(PostSummaryFunctionDefinition, {
  announcements: sendStep.outputs.announcements,
  channel: formStep.outputs.fields.channel,
  message_ts: draftStep.outputs.message_ts,
});

export default CreateAnnouncementWorkflow;
