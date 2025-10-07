# How to Get and Add Your Google Maps API Key

To enable the interactive map feature in this application, you need to provide a Google Maps API key. Follow these simple steps to get your key and add it to the project.

## Step 1: Get Your API Key from Google Cloud

1.  **Go to the Google Cloud Console:** Visit [https://console.cloud.google.com/](https://console.cloud.google.com/).
2.  **Create a New Project:** If you don't have one already, create a new project.
3.  **Enable APIs:**
    *   Navigate to the "APIs & Services" > "Library" section.
    *   Search for and enable the **"Maps JavaScript API"**.
    *   You may also need to enable the **"Geocoding API"** if you want to search for locations by address.
4.  **Create Credentials:**
    *   Go to "APIs & Services" > "Credentials".
    *   Click "+ CREATE CREDENTIALS" and select "API key".
    *   Your new API key will be displayed. Copy it to your clipboard.
5.  **Secure Your API Key (Recommended):**
    *   Click on the new API key to edit its settings.
    *   Under "Application restrictions," select "HTTP referrers (web sites)".
    *   Add your website's domain (e.g., `your-website.com/*`) and `localhost:3000/*` for local development. This prevents others from using your key on their websites.
    *   Under "API restrictions," select "Restrict key" and choose the "Maps JavaScript API" and any other APIs you enabled.

## Step 2: Add the API Key to Your Project

1.  **Create a `.env.local` file:** In the root directory of the project, create a new file named `.env.local`. This file is for local environment variables and should not be committed to version control.
2.  **Add the Key:** Open the `.env.local` file and add the following line, replacing `YOUR_API_KEY_HERE` with the key you copied from the Google Cloud Console:

    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
    ```

3.  **Restart the Application:** If the application is running, stop it and restart it with `npm run dev` for the new environment variable to be loaded.

That's it! The interactive map should now work correctly. If you deploy this project to a hosting service like Vercel, you will need to add the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` as an environment variable in your project's settings on that platform.