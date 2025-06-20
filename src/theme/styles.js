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
    height: 70,
    width: 160,
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
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
    backgroundColor: 'transparent',
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
    backgroundColor: '#EEEDE7',
  },
  loginCenter: {
    flex: 1,
    width: '50vg',
    justifyContent: 'center',
    marginTop: '50%',
  },
  loginInput: {
    backgroundColor: 'gray',
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  loginBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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



   // REGISTER === Register.js

  registerBottom: {
   justifyContent: 'flex-end',
   alignItems: 'center',
   padding: 16,
  },
  registerCenter: {
   flex: 1,
   justifyContent: 'center',
   gap: 20,
   width: '100%',
  },
  registerContainer: {
   flex: 1,
   backgroundColor: '#f5f5f5',
   paddingHorizontal: 20,
   overflow: 'hidden',
  },
  registerRow: {
   justifyContent: 'space-between',
   alignItems: 'center',
   marginTop: 15,
  },
  registerIdade: {
    backgroundColor: "#fff",
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '27%',
    marginLeft: '1%',
    borderColor: "#2E8331",
    borderWidth: 2,
    color:"#333",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerBackground: {
   height: '100%',
   width: '100%',
   },

   // HEALTH - REGISTER === HealthRegister.js

  hrContainer: {
   flex: 1,
   backgroundColor: '#f5f5f5',
   paddingHorizontal: 20,
   overflow: 'hidden',
  },
  hrForm: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
   gap: 20,
   width: '100%',
  },
  hrLink: {
   alignItems: 'center',
   marginTop: -20,
  },
  hrLinkText: {
   fontSize: 16,
   color: '#2E8331',
   textDecorationLine: 'underline',
  },
  hrBottom: {
   justifyContent: 'flex-end',
   alignItems: 'center',
   marginTop: 150,
  },

// RESTRIÇÕES === Restrições.js

  rtContainer:{
   flex: 1,
   alignContent: 'center',
   backgroundColor: '#f5f5f5',
   paddingHorizontal: 20,
   overflow: 'hidden',
  },
  rtCenter:{
   justifyContent: 'center',
   alignItems: 'center',
   marginTop: 50,
   gap: 20,
  },
  rtButton: {
   justifyContent: 'flex-end',
   alignItems: 'center',
   marginTop: 150,
  },

});

export default styles;