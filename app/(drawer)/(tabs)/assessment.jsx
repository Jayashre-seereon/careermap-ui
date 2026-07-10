import Constants from 'expo-constants';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const assessmentUrl = '/assessment/phycometricfulltest.html';

function getNativeAssessmentUrl() {
  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost;
  if (!hostUri) {
    return assessmentUrl;
  }

  const normalizedHost = hostUri.replace(/^exp:\/\//, 'http://').replace(/^http:\/\/http:\/\//, 'http://');
  const baseUrl = normalizedHost.startsWith('http://') || normalizedHost.startsWith('https://')
    ? normalizedHost
    : `http://${normalizedHost}`;

  return `${baseUrl}${assessmentUrl}`;
}

export default function AssessmentScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <iframe
          src={assessmentUrl}
          title="Psychometric Assessment"
          style={{ border: 0, width: '100%', height: '100vh' }}
        />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: getNativeAssessmentUrl() }}
      originWhitelist={['*']}
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#b12d1f" />
          <Text style={{ marginTop: 12, color: '#5f514d', fontSize: 14 }}>Loading assessment...</Text>
        </View>
      )}
    />
  );
}
