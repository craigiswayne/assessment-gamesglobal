import './Tile.scss';

export default function Tile({ data }) {
    return (
        <div className='tile'>
            <img src={data.sites[0].logoSmall2x} alt='Tile Image'/>
            <h4>{data.title}</h4>
            <p>{data.shortDescription}</p>
        </div>
    );
}
