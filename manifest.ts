import { Manifest } from "deno-slack-sdk/mod.ts";
import AnnouncementDatastore from "./datastores/announcements.ts";
import DraftDatastore from "./datastores/drafts.ts";
import { AnnouncementCustomType } from "./functions/send_announcement/types.ts";
import CreateAnnouncementWorkflow from "./workflows/create_announcement.ts";

export default Manifest({
  name: "vacation-announcement-bot",
  description: "Send an announcement to one or more channels",
  icon: "assets/icon.png",
  outgoingDomains: ["cdn.skypack.dev"],
  datastores: [DraftDatastore, AnnouncementDatastore],
  types: [AnnouncementCustomType],
  workflows: [
    CreateAnnouncementWorkflow,
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "chat:write.customize",
    "datastore:read",
    "datastore:write",
  ],
});
