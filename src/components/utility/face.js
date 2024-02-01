import store from "../../store/store";


class Face {

    constructor(bc) {
        // create socket
        this.bc = bc;
    }

    async initialize() {

        this.bc.onmessage = (eventMessage) => {
            console.log(eventMessage.data)
            this.receiveData(eventMessage.data)
            
           }

    }

    receiveData(data) {
        let newData= {}
        for (const shape of data.categories){
            newData[shape.categoryName]=shape.score
        };

        /*
        //append the raw channels
        for (let i = 0; i < chns.length; i++) {
            let key = chns[i];
            let val = rawVector[i];
            newData[key] = val;
        }*/
        store.dispatch({ type: 'devices/streamUpdate', payload: { id: "Face Landmarks", data: newData } })
    }

    isOpen(){
        return true;
    }
      

}

export default Face;