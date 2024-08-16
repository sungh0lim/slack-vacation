import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import CreateAnnouncementWorkflow from "../workflows/create_announcement.ts";

/**
 * This is a definition file for a shortcut link trigger
 * For more on triggers and other trigger types:
 * https://api.slack.com/automation/triggers
 */
const trigger: Trigger<
  typeof CreateAnnouncementWorkflow.definition
> = {
  type: TriggerTypes.Shortcut,
  name: "휴가공유",
  description: "당신의 휴가를 마음것 공유하세요.",
  workflow: `#/workflows/${CreateAnnouncementWorkflow.definition.callback_id}`,
  inputs: {
    created_by: {
      value: TriggerContextData.Shortcut.user_id,
    },
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
