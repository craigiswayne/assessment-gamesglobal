import Tile from '../Tile/Tile';
import './Results.scss';
import CircularProgress from '@mui/material/CircularProgress';

export default function Results({ filteredItems }) {
    if(filteredItems === null) {
        return (<div className='loading'>
            <CircularProgress />
            <p>Loading...</p>
        </div>);
    }

    if(!filteredItems.length || filteredItems.length === 0) {
        return (<p className='message error'>No results for the selection...</p>);
    }

    return (
        <div id='results'>
            {filteredItems.map((item: any, index: number) => (<Tile key={index} data={item} />))}
        </div>
    );
}