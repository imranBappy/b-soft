function removeCookies(origin) {
    chrome.browsingData.remove({
        origins: [origin]
    }, {
        cookies: true,
        cache: true,
        localStorage: true
    }, () => {
        console.log("All data cleared from:", origin);
    });
}

function getCookies(token, itemId) {
    return new Promise((resolve, reject) => {
        // http://localhost:8000/ https://api.b-soft.xyz/graphql/
        fetch(`https://api.b-soft.xyz/graphql/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `bearer ${token}`,
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                query: `
                mutation  {
                orderProductCredentialAccess(orderProductId: ${itemId}) {
                    success
                      access{
                            id
                            isExpired
                                credential{
                                    download
                                		cookies
                                  }
                                expiredDate
                                createdAt
                                accessCount
                                accessLimit
                    }
                }
                }
                `,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Received cookies:", data);
                resolve(data);
            })
            .catch(error => {
                console.error("Error fetching cookies:", error);
                reject(error);
            });
    });
}

function setCookies(cookies, url) {
    cookies.forEach((cookie) => {
        let cookieDetails = {
            url: url,
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path || "/",
            secure: cookie.secure || false,
            httpOnly: cookie.httpOnly || false,
            sameSite: ["lax", "strict", "none"].includes(cookie.sameSite) ? cookie.sameSite : "lax",
        };

        // If expirationDate exists, add it
        if (cookie.expirationDate) {
            cookieDetails.expirationDate = cookie.expirationDate;
        }

        console.log(cookieDetails);



        // Set the cookie
        chrome.cookies.set(cookieDetails, () => {
            if (chrome.runtime.lastError) {
                console.error("Error setting cookie:", chrome.runtime.lastError.message);
            }
        });
    });

}



chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {

        // check is it expired or not
        chrome.storage.local.get(["itemId", "url", "btoken"], async (data) => {
            if (data.itemId && data.url && data.btoken) {
                const response = await getCookies(data.btoken, data.itemId);
                const access = response?.data?.orderProductCredentialAccess?.access;
                if (!access) {
                    console.log("Cookies expired! Removing...");
                    if (data.url) {
                        removeCookies(data.url);
                    }
                    // Clear storage
                    chrome.storage.local.remove(["itemId", "url", "btoken"]);
                    chrome.tabs.reload(tabId, {}, () => {
                        console.log("Tab reloaded!");
                    });
                }
            }
        });

        const url = new URL(tab.url);
        const token = url.searchParams.get("access"); // Get search query
        const itemId = url.searchParams.get("itemId"); // Get search query


        if (token) {
            // Send request to the server
            const response = await getCookies(token, itemId);
            console.log("Response from server:", response);
            const access = response?.data?.orderProductCredentialAccess?.access;
            const cookies = access?.credential?.cookies; // Assuming the server returns cookies in this format
            const accessUrl = access?.credential?.download; // Assuming the server returns item in this format
            if (cookies && accessUrl) {
                setCookies(JSON.parse(cookies), accessUrl);
            }


            // set url
            chrome.storage.local.set({ url: accessUrl, btoken: token, itemId: itemId }, () => {
                console.log("Stored url and time set:", accessUrl);
            });


            // reload the tab
            chrome.tabs.reload(tabId, {}, () => { });

            // remove the query param from the URL
            const newUrl = url.origin + url.pathname;
            chrome.tabs.update(tabId, { url: newUrl }, () => {
                console.log("URL updated to:", newUrl);
            });

        }
    }
});

console.log("Service Worker starting...");


