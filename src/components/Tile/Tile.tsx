import './Tile.scss';
// @ts-ignore
export default function Tile({ data }) {
    return (
        <div className='tile'>
            <img src={`/images/logo-${data.site}.svg`} />
            <h4>{data.title}</h4>
            <p>{data.description}</p>
        </div>
    );
}
