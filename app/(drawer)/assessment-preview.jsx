import { useMemo } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import { WebView } from 'react-native-webview';
import { useAppState } from '../../src/app-state';
import { palette } from '../../src/careermap-data';

export default function AssessmentPreviewScreen() {
  const { preferences } = useAppState();
  const htmlAsset = useMemo(
    () => Asset.fromModule(require('../../assets/assessment/phycometrichalftest.html')),
    []
  );

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
