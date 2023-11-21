import {useEffect} from 'react';
import './FilterBar.scss';
import FilterOption from '../FilterOption/FilterOptions';

// @ts-ignore
export default function FilterBar({ resultsFetched }) {

    let _cachedResults: [];

    const filterBySiteOptions = [
        {
            value: 'product-hunt',
            label: 'Product Hunt'
        },
        {
            value: 'indeed',
            label: 'Indeed'
        },
        {
            value: 'linkedin',
            label: 'LinkedIn'
        },
        {
            value: 'eventbrite',
            label: 'EventBrite'
        }
    ];

    const filterByCategoryOptions = [
        {
            label: 'SEO',
            value: 'seo'
        },
        {
            label: 'Competitive Intelligence',
            value: 'competitive-intelligence'
        }
    ];

    const fetchResults = async (useCache = true) => {
        if(useCache && _cachedResults !== undefined){
            resultsFetched(_cachedResults);
        }
        try {
            const response = await fetch('/data/Assessment.json');
            const jsonResponse = await response.json();
            _cachedResults = jsonResponse.data.oneClickAutomations.items;
            resultsFetched(_cachedResults);
        } catch (error: any) {
            // Skipping better error checking for the assessment purpose
            alert('Error fetch data...')
        }
    };

    /**
     * On initial load, fetch all results
     */
    useEffect(() => {
        fetchResults();
    }, []);

    return (<section id='filter-bar'>
        <div className='show-all'>See all</div>
        <div>
            <FilterOption attributes={{type: 'toggle', icon: 'arrow-down-up', label: 'Extract Data'}} />
            <FilterOption attributes={{type: 'toggle', icon: 'display', label: 'Monitoring'}} />
            <FilterOption attributes={{type: 'dropdown', label: 'Filter by Site', options: filterBySiteOptions, target: 'site'}} />
            <FilterOption attributes={{type: 'dropdown', label: 'Filter by Categorie', options: filterByCategoryOptions}} />
        </div>
    </section>);
}
