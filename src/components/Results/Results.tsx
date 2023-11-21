// @ts-ignore
import Tile from '../Tile/Tile';
import './Results.scss';


// @ts-ignore
export default function Results({ filteredItems }) {
    return (
        <div id='results'>
            {
                filteredItems !== null && filteredItems.length && filteredItems.length !== 0 ?
                (
                    filteredItems.map((item: any, index: number) => (<Tile key={index} data={item} />))
                )
                : (<p>no results</p>)
            }
        </div>
    );
}