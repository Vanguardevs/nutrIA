import { StyleSheet } from 'react-native';
import Theme from './theme.js'

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'space-between',
    alignItems: 'center',
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
  welcomeButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius,
    height: 80,
    width: 160,
    justifyContent: 'center',
    marginTop: 190,
  },
  welcomeButtonText: {
    fontSize: 27,
    textAlign: 'center',
    color: 'white'
  },
  welcomeText: {
    fontSize: 35,
    textAlign: 'center',
    color: '#016E3A',
    fontFamily: 'K2D-BoldItalic',
    width: 230,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  welcomeImage: {
    height: 210,
    width: 280,
    paddingTop: 20,
    marginTop: 60,
  },
  welcomeBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  }
});

export default styles;