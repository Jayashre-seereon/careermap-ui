import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useAppState } from '../../src/app-state';
import { API_BASE_URL } from '../../src/api/axios';
import { palette } from '../../src/careermap-data';

export default function AssessmentPreviewScreen() {
  const { preferences } = useAppState();
  const assessmentApiBaseUrl = API_BASE_URL || 'http://localhost:5000/api';
  const htmlAsset = useMemo(
    () => Asset.fromModule(require('../../assets/assessment/phycometrichalftest.html')),
    []
  );

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.localStorage.setItem('API_BASE_URL', assessmentApiBaseUrl);
    }
  }, [assessmentApiBaseUrl]);

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: preferences.darkMode ? '#050505' : palette.background }}>
        <View style={{ flex: 1 }}>
          <iframe
            title="Psychometric Assessment"
            src={htmlAsset.uri}
            style={{ border: 0, width: '100%', height: '100%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: preferences.darkMode ? '#050505' : palette.background }}>
        <WebView
          originWhitelist={['*']}
          source={{ uri: htmlAsset.uri }}
          injectedJavaScriptBeforeContentLoaded={`
            (function () {
              try {
              window.__CAREERMAP_API_BASE_URL__ = ${JSON.stringify(assessmentApiBaseUrl)};
              localStorage.setItem("API_BASE_URL", ${JSON.stringify(assessmentApiBaseUrl)});
              } catch (error) {}
            })();
            true;
          `}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'GO_DASHBOARD') {
            router.replace('/(drawer)/(tabs)');
          }
        }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={palette.primary} />
            <Text style={{ marginTop: 12, color: preferences.darkMode ? '#ffffff' : palette.text, fontWeight: '700' }}>
              Loading psychometric test...
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
