import { StyleSheet } from 'react-native';
import Theme from './theme.js'

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  curtain: {
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    height: 250,
    width: '100%',
    borderTopRightRadius: Theme.borderRadius,
    borderTopLeftRadius: Theme.borderRadius,
    marginTop: '40%',
    alignItems: 'center'
  },
  button: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius,
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
    borderRadius: Theme.borderRadius
  }
});

export default styles;