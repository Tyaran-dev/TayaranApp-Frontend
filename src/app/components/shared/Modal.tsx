
interface modalProps {
    isOpen: any,
    onClose: any,
    children: any,
    modalClass?: any,
}

const Modal: React.FC<modalProps> = ({
    isOpen,
    onClose,
    children,
    modalClass,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex p-4 px-6  items-center  justify-center z-50">
            <div
                className="fixed top-0 left-0 w-full h-full bg-[#00000093] "
                onClick={onClose}
            ></div>
            <div
                className={`fixed w-full custom-scrollbar flex  gap-4 items-center overflow-auto justify-center  px-4 py-3 rounded-lg  shadow-lg ${modalClass}`}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
