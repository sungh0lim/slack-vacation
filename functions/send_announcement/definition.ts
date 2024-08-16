import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { AnnouncementCustomType } from "../send_announcement/types.ts";

export const SEND_ANNOUNCEMENT_FUNCTION_CALLBACK_ID = "send_announcement";
/**
 * This is a custom function definition that sends an
 * announcement to the supplied channel
 *
 * More on custom function definition here:
 * https://api.slack.com/automation/functions/custom
 */
export const PrepareSendAnnouncementFunctionDefinition = DefineFunction({
  callback_id: SEND_ANNOUNCEMENT_FUNCTION_CALLBACK_ID,
  title: "Send an announcement",
  description: "Sends a message to one or more channels",
  source_file: "functions/send_announcement/handler.ts",
  input_parameters: {
    properties: {
      holiday_date: {
        type: Schema.types.string,
        description:
          "The date of the announcement (ex. 2024.11.17 ~ 2024.11.20)",
      },
      holiday_type: {
        type: Schema.types.string,
        description: "The type of holiday",
      },
      message: {
        type: Schema.types.string,
        description: "The content of the announcement",
      },
      channels: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.channel_id,
        },
        description: "The destination channels of the announcement",
      },
      username: {
        type: Schema.types.string,
        description: "Optional custom bot emoji avatar to use in announcements",
      },
    },
    required: [
      "channels",
    ],
  },
  output_parameters: {
    properties: {
      announcements: {
        type: Schema.types.array,
        items: {
          type: AnnouncementCustomType,
        },
        description:
          "Array of objects that includes a channel ID and permalink for each announcement successfully sent",
      },
    },
    required: ["announcements"],
  },
});
