import { StyleSheet } from 'react-native';
import Theme from './theme.js'

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'flex',
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
  welcomeButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius,
    height: 80,
    width: 160,
    justifyContent: 'center',
    marginTop: 150,
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
    marginTop: 10,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  welcomeImage: {
    height: 230,
    width: 295,
    borderRadius: Theme.borderRadius,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    marginTop: 80,
  },
  welcomeBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 800,
    width: 400,
  
  },
 

});

export default styles;