# Vacation Announcement Bot

휴가공유를 위한 Slack Bot API 입니다.

## How to Start?

### Install Deno

```shell
curl -fsSL https://deno.land/install.sh | sh

~ ❯ deno --version                                                     23:00:23
deno 1.45.5 (release, aarch64-apple-darwin)
v8 12.7.224.13
typescript 5.5.2
```

### Install Slack CLI

[Install](https://api.slack.com/automation/cli/install-mac-linux) 문서를 참고해주세요.

- `.tar.gz` 파일을 다운로드 받고 실행하면 `bin` 폴더가 생깁니다. 내부에 있는 `slack` 파일을 `/usr/local/bin` 경로로 옮기면 slack cli 실행이 가능합니다.

```shell
~ ❯ slack version                                                      23:08:07
Using slack v2.29.1
```

### Slack CLI Login

```shell
~ ❯ slack doctor

    ✘ Credentials (your Slack authentication)
      Error: You are either not logged in or your login session has expired (not_authed)
      Suggestion: Authorize your CLI with `slack login`
```

```shell
~ ❯ slack login

📋 Run the following slash command in any Slack channel or DM
   This will open a modal with user permissions for you to approve
   Once approved, a challenge code will be generated in Slack

/slackauthticket ***

? Enter challenge code ***

🔑 You've successfully authenticated!
   Authorization data was saved to ~/.slack/credentials.json

💡 Get started by creating a new app with slack create my-app
   Explore the details of available commands with slack help
```

```shell
~ ❯ slack auth list

yogiyo (Team ID: ***)
User ID: ***
Last Updated: 2024-08-15 23:09:59 +09:00
Authorization Level: Workspace
```

## Run

```shell
slack run
```

## Deploy

```shell
slack deploy
```
