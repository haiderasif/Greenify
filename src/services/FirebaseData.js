import { createContext, useState,useEffect } from "react";
import { getDatabase, ref, onValue,update } from 'firebase/database';
import { getAuth } from "firebase/auth";


export const FirebaseContext = createContext()


export const FirebaseContextProvider =  ({children}) => {
    const [myCampaignData, setMyCampaignData] = useState([])
    const [mapData, setMapData] = useState([])
    const [listingData, setListingData] = useState([])
    const [campaignData, setCampaignData] = useState([])
    const [listingCampaignData, setListingCampaignData] = useState([])
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [registeredCampaignUsers, setRegisteredCampaignUsers] = useState([])

    const GetRegisteredCampaignUsers = (details) => {
      const dateobj = new Date()
      const month = dateobj.getMonth()+1
      var day = dateobj.getDate()
      if(day<10)
      {
        day = '0'+day
      }
      const year = dateobj.getFullYear()
      const date = month+'/'+day+'/'+year
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getDatabase();
    const reference = ref(db, 'CampaignList');
    onValue(reference, snapshot => {
      var finished = []
      snapshot.forEach((data) => {
        let result = data.val()
        if(result.CampaignId == details.detail.userId)
        {
        result["key"]  = data.key;
        finished.push(result)
        }
      })
      setRegisteredCampaignUsers(finished)
    })
    }

    const GetRegisteredUsers = () => {
      const dateobj = new Date()
      const month = dateobj.getMonth()+1
      var day = dateobj.getDate()
      if(day<10)
      {
        day = '0'+day
      }
      const year = dateobj.getFullYear()
      const date = month+'/'+day+'/'+year
      const auth = getAuth();
  const user = auth.currentUser;
      const db = getDatabase();
    const reference = ref(db, 'CampaignList');
    onValue(reference, snapshot => {
      var finished = []
      snapshot.forEach((data) => {
        let result = data.val()
        if(result.CampaignId == user.uid)
        {
        result["key"]  = data.key;
        finished.push(result)
        }
      })
      setRegisteredUsers(finished)
    })
    }
    
    const GetListingCampaign = () => {
      const db = getDatabase();
      const reference = ref(db, 'Campaign');
      onValue(reference, snapshot => {
          var finished = []
        snapshot.forEach((data) => {
          let result = data.val()
          result["key"]  = data.key;
          finished.push(result)
        })
        setListingCampaignData(finished)
      })
      }

    const GetCampaign = () => {
    const db = getDatabase();
    const reference = ref(db, 'Campaign');
    onValue(reference, snapshot => {
        var finished = []
      snapshot.forEach((data) => {
        let result = data.val()
        result["key"]  = data.key;
        if(finished.length == 0)
        {
        finished.push(result)
        }
        else 
        {
          finished.unshift(result)
        }
      })
      setCampaignData(finished)
    })
    }
    const GetMyCampaign = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getDatabase();
        const reference = ref(db, 'Campaign');
        onValue(reference, snapshot => {
            var finished = []
          snapshot.forEach((data) => {
            let result = data.val()
            if(result.userId == user.uid)
            {
            result["key"]  = data.key;
            finished.push(result)
            }
          })
          setMyCampaignData(finished)
        })
    }

    const GetListingData = () => {
        const db = getDatabase();
        const reference = ref(db, 'listing');
        onValue(reference, snapshot => {
        var finished = []
        snapshot.forEach((data) => {
            let result = data.val()
            result["key"]  = data.key;
            if(finished.length == 0)
            {
            finished.push(result)
            }
            else 
            {
              finished.unshift(result)
            }
            })
        setListingData(finished)
    })
    }

    const GetMapData = () => {
        const db = getDatabase();
        const reference = ref(db, 'data');
        onValue(reference, snapshot => {
        var finished = []
        snapshot.forEach((data) => {
            let result = data.val()
            result["key"]  = data.key;
            finished.push(result)
          })
          setMapData(finished)
        })
    }
    const CheckCampaign = () => {
      const dateobj = new Date()
      const month = dateobj.getMonth()+1
      var day = dateobj.getDate()
      if(day<10)
      {
        day = '0'+day
      }
      const year = dateobj.getFullYear()
      const date = month+'/'+day+'/'+year
      const db = getDatabase();
      const reference = ref(db, 'Campaign');
      onValue(reference, snapshot => {
        snapshot.forEach((data) => {
          let result = data.val()
          result["key"]  = data.key;
          if(result.startDate <= date && result.CampaignStatus == 'inProcess')
          {
            console.log(result.key);
            const updateList = ref(db, 'Campaign/'+result.key);
            update(updateList, {
              CampaignStatus: "Complete"
            });
          }
        })
      })
      }
    return (
        <FirebaseContext.Provider
        value = {{
            GetMyCampaign,
            GetMapData,
            GetListingData,
            GetCampaign,
            GetListingCampaign,
            GetRegisteredUsers,
            GetRegisteredCampaignUsers,
            CheckCampaign,
            registeredCampaignUsers,
            registeredUsers,
            listingData,
            myCampaignData,
            mapData,
            campaignData,
            listingCampaignData,
        }}
        >
            {children}
        </FirebaseContext.Provider>
    )
}