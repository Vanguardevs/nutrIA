import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: 'green',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  curtain: {
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    height: 250,
    width: '100%',
    borderTopRightRadius: 21,
    borderTopLeftRadius: 21,
    marginTop: '40%',
    alignItems: 'center'
  },
  welcomeButton: {
    backgroundColor: 'blue',
    borderRadius: 26,
    height: 80,
    width: 160,
    justifyContent: 'center'
  },
  welcomeButtonText: {
    fontSize: 27,
    textAlign: 'center',
    color: 'white'
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  welcomeImage: {
    height: 220,
    width: 270,
    borderRadius: 12
  }
});

export default styles;