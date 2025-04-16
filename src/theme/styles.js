import { StyleSheet } from 'react-native';
import Theme from './theme.js'

const styles = StyleSheet.create({

  // WELCOME === INDEX.JS
  welcomeContainer: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeCurtain: {
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
    height: 60,
    width: "55vh",
    justifyContent: 'center',
    marginTop: 190,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 12,
    
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
  },
  gradientContainer: {
    height: 60,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default styles;