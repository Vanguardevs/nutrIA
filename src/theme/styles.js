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
    height: 60,
    width: 160,
    alignSelf: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 190,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 12,
  },
  welcomeButtonText: {
    fontSize: 27,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'K2D-Regular',
  },
  welcomeText: {
    fontSize: 30,
    textAlign: 'center',
    color: '#016E3A',
    fontFamily: 'K2D-Regular',
    width: '90%', 
    flexWrap: 'wrap',
    marginHorizontal: '5%',
    lineHeight: 35, 
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


   // LOGIN === LOGIN.JS

  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginCenter: {
    flex: 1,
    width: '50vg',
    justifyContent: 'center', // Center vertically
  },
  loginInput: {
    backgroundColor: 'gray',
    width: '80%', // Adjust the width as needed
    marginVertical: 10, // Add some vertical margin for spacing
    padding: 10,
    borderRadius: 10, // Add padding for better text input appearance
  },
  loginBottom: {
    flex: 1,
    justifyContent: 'flex-end', // Align to the bottom
    alignItems: 'center', // Center horizontally
    marginBottom: '10vh'
  },
  loginModal: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'black', 
    borderRadius: 10, 
    opacity: 1
},
  loginModalMessage: {
   flex: 1,
   justifyContent: 'center', 
   alignItems: 'center',
   backgroundColor: 'white',
},
  loginBackground: {

   height: '100%',
   width: '100%',
},
});

export default styles;