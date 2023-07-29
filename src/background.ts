const { Client } = require("@notionhq/client");
const { format } = require("date-fns");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const sleep = (msec: number) =>
    new Promise((resolve) => setTimeout(resolve, msec));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.tabs.query(
        { lastFocusedWindow: true, pinned: false },
        function (tabs) {
            const filteredTabs = tabs.filter((tab) => {
                if (!tab.url) return false;
                if (tab.url.startsWith("chrome://")) return false;
                if (tab.url.startsWith("chrome-extension://")) return false;
                if (tab.url.startsWith("http://localhost")) return false;
                if (tab.url.startsWith("https://localhost")) return false;
                return true;
            });

            const dateString = format(new Date(), "yyyy-MM-dd");

            (async () => {
                // get page content
                const blockList = await notion.blocks.children.list({
                    block_id: process.env.NOTION_PAGE_ID,
                    page_size: 50,
                });

                const target = blockList.results.find((block: any) => {
                    return (
                        block.type === "heading_2" &&
                        block.heading_2.rich_text[0].text.content === dateString
                    );
                });

                if (!target) {
                    console.log("Creating today's block");
                    await notion.blocks.children.append({
                        block_id: process.env.NOTION_PAGE_ID,
                        after: blockList.results[0].id,
                        children: [
                            {
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
                            },
                        ],
                    });
                    console.log("Created today's block");
                }

                await sleep(200);

                const createdTarget = blockList.results.find((block: any) => {
                    return (
                        block.type === "heading_2" &&
                        block.heading_2.rich_text[0].text.content === dateString
                    );
                });
                if (!createdTarget) {
                    console.error("Cannot find today's block");
                    return;
                }

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

                await notion.blocks.children.append({
                    block_id: process.env.NOTION_PAGE_ID,
                    after: createdTarget.id,
                    children: blocks,
                });

                console.log("Complete: added blocks to Notion");

                chrome.tabs.remove(
                    filteredTabs.flatMap((tab) => tab.id ?? []),
                    () => {}
                );

                sendResponse({ success: true });
            })().catch((e) => {
                console.error(e);
                sendResponse({ success: false, error: e });
            });
        }
    );
    return true;
});
