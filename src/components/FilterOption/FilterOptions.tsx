import './FilterOption.scss';

// @ts-ignore
export default function FilterOption({attributes}) {
    attributes.icon = attributes.type === 'dropdown' ? 'plus' : attributes.icon;
    return (
        <div className={`filter ${attributes.type}`}>
            <img className='icon' src={`/images/icon-${attributes.icon}.svg`}  alt='icon'/>
            <span className='label'>{attributes.label}</span>
        </div>
    );
}