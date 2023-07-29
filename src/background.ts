import { Client } from "@notionhq/client";
import { format } from "date-fns";
import browser from "webextension-polyfill";

const sleep = (msec: number) =>
    new Promise((resolve) => setTimeout(resolve, msec));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        const { note, token } = await browser.storage.local.get([
            "note",
            "token",
        ]);
        const notion = new Client({ auth: token });
        const tabs = await browser.tabs.query({
            lastFocusedWindow: true,
            pinned: false,
        });
        const filteredTabs = tabs.filter((tab) => {
            if (!tab.url) return false;
            if (tab.url.startsWith("chrome://")) return false;
            if (tab.url.startsWith("chrome-extension://")) return false;
            if (tab.url.startsWith("http://localhost")) return false;
            if (tab.url.startsWith("https://localhost")) return false;
            return true;
        });

        const dateString = format(new Date(), "yyyy-MM-dd");

        // get page content
        const blockList = await notion.blocks.children.list({
            block_id: note,
            page_size: 50,
        });

        const dateBlock = blockList.results.find((block: any) => {
            return (
                block.type === "heading_2" &&
                block.heading_2.rich_text[0].text.content === dateString
            );
        });

        const blocks = filteredTabs.map((tab) => {
            return {
                object: "block",
                type: "bulleted_list_item",
                bulleted_list_item: {
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: tab.title,
                                link: {
                                    url: tab.url,
                                },
                            },
                        },
                    ],
                },
            };
        });

        const newDateBlock = {
            object: "block",
            type: "heading_2",
            heading_2: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: dateString,
                        },
                    },
                ],
            },
        };

        if (dateBlock) {
            await notion.blocks.children.append({
                block_id: note,
                after: dateBlock.id,
                // @ts-ignore
                children: blocks,
            });
        } else {
            console.log("Creating today's block");
            await notion.blocks.children.append({
                block_id: note,
                after: blockList.results[0].id,
                // @ts-ignore
                children: [newDateBlock, ...blocks],
            });
            console.log("Created today's block");
        }

        console.log("Complete: added blocks to Notion");

        await browser.tabs.remove(filteredTabs.flatMap((tab) => tab.id ?? []));
    })()
        .then(() => {
            sendResponse({ success: true });
        })
        .catch((e) => {
            console.error(e);
            sendResponse({ success: false, error: e });
        });
    return true;
});
