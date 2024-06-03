import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "#212121",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    height: "80%",
  },
  searchContainer: {
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 22,
    paddingBottom: 22,
    backgroundColor: '#010312',
    borderBottomWidth: '2px',
    borderBottomColor: '#ff0000',
},
  cardContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    backgroundColor: '#2E2E2E',
    padding: 10,
    borderRadius: 15,
  },
  bookCover: {
    width: 70,
    height: 105,
    borderRadius: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  modalCover: {
    width: 100,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  bookInfo: {
    marginLeft: 10,
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6abdff',
  },
  bookAuthor: {
    textAlign: 'left',
    paddingTop: 10,
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalTitle: {
    paddingTop: 20,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6abdff',
    overflow: 'hidden',
  },
  secondModalTitle: {
    paddingTop: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6abdff',
    overflow: 'hidden',
  },
  smallModalView: {
    margin: 20,
    backgroundColor: "#2e2e2e",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '25%', 
    width: '90%',  
  },
  thirdStepModalView: {
    margin: 20,
    backgroundColor: "#2e2e2e",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '35%', 
    width: '90%',  
  },
  modalText: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalDescription: {
    paddingTop: 10,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  bookDescription: {
    paddingTop: 10,
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "#2e2e2e",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '70%',
    width: '80%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});

export default styles;