import { useState } from 'react';
import ModalContext from './ModalContext';



const ModalContextProvider = ({ children }) => {

        const [open, setOpen] = useState(false);
        const [tweetId, setTweetId] = useState(null);

        const onOpenModal = (id) => {
            // console.log(id,'in context');
            setTweetId(id);
            setOpen(true);
        }//setOpen(true) && setTweetId(id) && console.log(id,'context');
        const onCloseModal = () => {
            setTweetId(null);
            setOpen(false);
        }

    return (
        <ModalContext.Provider
            value={{
                open,
                tweetId,
                onOpenModal,
                onCloseModal
            }}>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalContextProvider;