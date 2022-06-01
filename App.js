import React, {useEffect} from 'react';
import dict from './dict.json';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  Text,
  View,
  FlatList,
} from 'react-native';

const App = () => {
  const [text, setText] = React.useState('');
  const [excludedLetters, setExcludedLetters] = React.useState('');
  const [result, setResult] = React.useState([]);
  const [wordLength, setWordLength] = React.useState(0);

  const DICT_STRING = JSON.stringify(dict);

  const buildRegEx = keywords => {
    return new RegExp(
      '"(?=[^"]*?' + keywords.split('').join(')(?=[^"]*?') + ').*?"',
      'gi',
    );
  };

  const renderItem = ({item}) => <Text title={item}>{item}</Text>;

  useEffect(() => {
    if (text) {
      const reg = buildRegEx(text);
      let match = DICT_STRING.match(reg);
      if (!match) {
        match = [];
      }

      if (match.length > 0) {
        match = match.map(s => s.slice(1, -1));

        if (wordLength) {
          match = match.filter(s => s.length <= +wordLength);
        }

        if (excludedLetters) {
          let reg2 = new RegExp(`^[^${excludedLetters}]+$`, 'gi');
          match = match.filter(s => reg2.test(s));
        }
      }
      setResult(match);
    }
  }, [DICT_STRING, text, wordLength, excludedLetters]);

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#5178d2" />
      <View>
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="искомые буквы"
        />
        <TextInput
          style={styles.input}
          onChangeText={setExcludedLetters}
          value={excludedLetters}
          placeholder="исключить буквы"
        />
        <TextInput
          style={styles.input}
          onChangeText={setWordLength}
          value={wordLength ? '' + wordLength : ''}
          keyboardType="numeric"
          placeholder="длина слова"
        />
        <FlatList
          data={result}
          renderItem={renderItem}
          keyExtractor={item => item}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default App;
