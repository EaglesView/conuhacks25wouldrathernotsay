interface CardProps {
    children?:React.ReactNode;
    className?:string;
    header?:string;
    canBeCancelled?:boolean;
}
const Card:React.FC<CardProps> = ({children,className}) => {
    return (
        <div className={`${className} rounded-md `}>
            {children}
        </div>
    );
}

export default Card;