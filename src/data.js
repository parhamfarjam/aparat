import { FaGamepad, FaMusic } from 'react-icons/fa'
import { IoIosMail } from 'react-icons/io'
import { IoMoveOutline, IoPlay } from 'react-icons/io5'

export const categories = [
    {id: 1, name: 'Games',iconSrc:<FaGamepad />},
    {id: 2, name: 'Movie',iconSrc:<IoMoveOutline />},
    {id: 3, name: 'Funny',iconSrc:<IoIosMail />},
    {id: 4, name: 'music',iconSrc:<FaMusic />},
    {id: 5, name: 'Animation',iconSrc:<IoPlay />},
]