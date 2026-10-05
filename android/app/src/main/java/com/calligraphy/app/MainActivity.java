package com.calligraphy.app;

import com.getcapacitor.BridgeActivity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.Display;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.os.Build;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Window window = getWindow();
        // 1. Force hardware acceleration at window level
        window.setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );

        // 2. Unlock 120Hz peak refresh rate on Huawei MatePad display
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                Display display = null;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    display = getDisplay();
                } else {
                    display = getWindowManager().getDefaultDisplay();
                }
                if (display != null) {
                    Display.Mode[] modes = display.getSupportedModes();
                    Display.Mode maxMode = null;
                    for (Display.Mode m : modes) {
                        if (maxMode == null || m.getRefreshRate() > maxMode.getRefreshRate()) {
                            maxMode = m;
                        }
                    }
                    if (maxMode != null && maxMode.getRefreshRate() >= 90.0f) {
                        WindowManager.LayoutParams params = window.getAttributes();
                        params.preferredDisplayModeId = maxMode.getModeId();
                        window.setAttributes(params);
                    }
                }
            } catch (Exception ignored) {}
        }

        // 3. Optimize WebView rendering pipeline
        if (bridge != null && bridge.getWebView() != null) {
            WebView webView = bridge.getWebView();
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
            WebSettings settings = webView.getSettings();
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
        }

        // 4. Hide system UI for immersive full-screen mode
        window.getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
        );
    }
}

