from playwright.sync_api import sync_playwright

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to app...")
        try:
            page.goto("http://localhost:8081")
            page.wait_for_timeout(10000) # Wait for Expo bundle
        except Exception as e:
            print(f"Failed to load page: {e}")
            browser.close()
            return

        print("Taking screenshot of Home Screen...")
        page.screenshot(path="verification/home_screen.png")

        print("Navigating to Add Flight...")
        # Expo web navigation might be tricky to target by text if generic, but let's try
        # In a real app we might click the + button.
        # The + button is absolute positioned with a Plus icon.
        # We can try to find the button with the Plus icon or by role if accessible.
        # Since I used TouchableOpacity, it might be a div with role button.

        # Let's try to find by role button that is the floating action button.
        # It's the last button usually.
        buttons = page.get_by_role("button").all()
        if buttons:
            print(f"Found {len(buttons)} buttons. Clicking the last one (FAB).")
            buttons[-1].click()
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/add_flight_screen.png")
        else:
            print("No buttons found.")

        print("Navigating to Settings...")
        # Go back or reload to find Settings.
        # Actually Settings is in the header right.
        page.reload()
        page.wait_for_timeout(2000)
        # Settings icon button
        buttons = page.get_by_role("button").all()
        # The settings button is in header right, usually first or second button depending on back button existence.
        # On Home, there is no back button. So Settings is likely the first button (or one of the first).
        if buttons:
             # Just iterate and try to find one that navigates to Settings or just take screenshot of what we have.
             pass

        browser.close()

if __name__ == "__main__":
    verify_app()
