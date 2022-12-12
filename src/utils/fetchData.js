import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore"


export const getAllFeeds = async(firebaseDb)=>{
const feeds = await getDocs(
    query(collection(firebaseDb, 'videos'),orderBy('id' ,'desc'))
)
return feeds.docs.map((doc)=> doc.data())
}
///fetch user information form fairebase
export const getUserInfo = async (firebaseDb,userId)=>{
    const userRef = doc(firebaseDb, 'users' , userId)

    const userSnap = await getDoc(userRef)
    if(userSnap.exists()){
        return userSnap.data()
    }else{
        return 'no doc'
    }
}
////fetch specafic video
export const getSpecificVideo = async(firebaseDb,videoId)=>{
    const videoRef = doc(firebaseDb, 'videos' , videoId)

    const videoSnap = await getDoc(videoRef)
    if(videoSnap.exists()){
        return videoSnap.data()
    }else{
        return 'no doc'
    }
}
////delete video
export const deleteVideo = async (fireSoreDb,videoId)=>{
    await deleteDoc(doc(fireSoreDb,'videos', videoId))
}
///get recommnded video
export const recommendedFedds = async(firebaseDb , categoryId , videoId)=>{
    const feeds = await getDocs(
        query(collection(firebaseDb, 'videos'),
        where('category' , '==', categoryId),
        where('id', '!=' , videoId),
         orderBy('id' ,'desc'))
    )
    return feeds.docs.map((doc)=> doc.data())
    }
    ///useruploaded videos
    export const userUploadedVideos = async(firebaseDb,userId)=>{
        const feeds = await getDocs(
            query(collection(firebaseDb, 'videos'),
            where('userId', '==',  userId),
             orderBy('id' ,'desc'))
        )
        return feeds.docs.map((doc)=> doc.data())
        }

        ///categorywise feeds
        export const categoryFeeds = async(firebaseDb , categoryId)=>{
            const feeds = await getDocs(
                query(collection(firebaseDb, 'videos'),
                where('category' , '==', categoryId),
                 orderBy('id' ,'desc'))
            )
            return feeds.docs.map((doc)=> doc.data())
            }