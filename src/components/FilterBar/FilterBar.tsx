import {useEffect, useState} from 'react';
import './FilterBar.scss';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import MonitorIcon from '@mui/icons-material/Monitor';
import AddIcon from '@mui/icons-material/Add';

export default function FilterBar({ resultsFetched }) {

    const initialState = {
        keywords: [],
        sites: [],
        categories: []
    };
    const [selectedFilters, setSelectedFilters] = useState<{keywords: string[], sites: string[], categories: string[]}>(initialState)
    const [filterBySite, setFilterBySite] = useState<string[]>([]);
    const [filterByCategory, setFilterByCategory] = useState<string[]>([]);
    const [dropdownSitesOpen, setDropdownSitesOpen] = useState(false);
    const [dropdownCategoriesOpen, setDropdownCategoriesOpen] = useState(false);

    const siteOptions = [
        {
            "title": "LinkedIn",
            "slug": "linkedin"
        },
        {
            "title": "ProductHunt",
            "slug": "producthunt"
        },
        {
            "title": "Google",
            "slug": "google"
        },
        {
            "title": "Amazon",
            "slug": "amazon"
        },
        {
            "title": "Booking",
            "slug": "booking"
        },
        {
            "title": "FDA",
            "slug": "fda"
        },
        {
            "title": "Google Maps",
            "slug": "google-maps"
        },
        {
            "title": "Pinterest",
            "slug": "pinterest"
        },
        {
            "title": "Trip Advisor",
            "slug": "trip-advisor"
        },
        {
            "title": "Twitter",
            "slug": "twitter"
        },
        {
            "title": "Upwork",
            "slug": "upwork"
        },
        {
            "title": "Craigslist",
            "slug": "craigslist"
        },
        {
            "title": "Meetup",
            "slug": "meetup"
        }
    ].sort((a,b) => a.title < b.title ? -1 : 0);

    const categoryOptions = [
        {
            "title": "Competitive Intelligence",
            "slug": "competitive-intelligence"
        },
        {
            "title": "SEO",
            "slug": "seo"
        }
    ];

    const simulateWaitingForAPICall = async () => {
        // return setTimeout(() => {}, 1000 * 5);
        const delayPromise = ms => new Promise(res => setTimeout(res, ms))
        return delayPromise(1000);
    }

    const fetchResults = async () => {
        // This triggers the loader
        resultsFetched(null);
        await simulateWaitingForAPICall();
        try {
            const response = await fetch('/data/Assessment.json');
            const jsonResponse = await response.json();
            let results = jsonResponse.data.oneClickAutomations.items;
            results = results.sort((a,b) => a.priority - b.priority);

            /**
             * If there's filters applied...
             * ...filter them out
             */
            if(selectedFilters.keywords.length > 0 || selectedFilters.categories.length > 0 || selectedFilters.sites.length !== 0) {
                results = results.filter(item => {
                    let result = false;
                    selectedFilters.keywords.forEach(keyword => {
                        if(result === true){
                            return;
                        }

                        result = item.title.toLowerCase().indexOf(keyword) !== -1
                            || item.shortDescription.toLowerCase().indexOf(keyword) !== -1;
                    })

                    /**
                     * If it has already been determined that this item has matched, then bounce
                     */
                    // @ts-ignore
                    if(result === true){
                        return result;
                    }

                    selectedFilters.sites.forEach(siteSlug => {
                        if(result === true){
                            return;
                        }
                        result = item.sites[0].slug.toLowerCase() === siteSlug;
                    })

                    /**
                     * If it has already been determined that this item has matched, then bounce
                     */
                    // @ts-ignore
                    if(result === true){
                        return result;
                    }
                    selectedFilters.categories.forEach(selectedCategory => {
                        if(result === true){
                            return;
                        }
                        result = item.categories.filter(cat => cat.slug.toLowerCase() === selectedCategory).length !== 0;
                    })
                    return result;
                });
            }
            resultsFetched(results);
        } catch (error: any) {
            // Skipping better error checking for the assessment purpose
            alert('Error fetch data...')
            resultsFetched([]);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const resetAll = () => {
        setSelectedFilters(initialState);
        setFilterBySite(() => []);
        setFilterByCategory(() => []);
        fetchResults()
    }


    const toggleChip = (chipID: string) => {
        setSelectedFilters((selection) => {
            const existingIndex = selectedFilters.keywords.indexOf(chipID);
            existingIndex === -1 ? selection.keywords.push(chipID) : selection.keywords.splice(existingIndex, 1);
            return selection;
        });
        fetchResults();
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const openDropdownSites = () => {
        setDropdownSitesOpen(true);
    };
    const closeDropdownSites = () => {
        setDropdownSitesOpen(false);
    };

    const handleSitesDropdownChange = (event: SelectChangeEvent<typeof filterBySite>) => {
        const {
            target: {value},
        } = event;

        setFilterBySite(
            typeof value === 'string' ? value.split(',') : value,
        );
        setSelectedFilters(filters => {
            filters.sites = typeof value === 'string' ? value.split(',') : value;
            return filters;
        })
        fetchResults()
    };

    const openDropdownCategories = () => {
        setDropdownCategoriesOpen(true);
    };
    const closeDropdownCategories = () => {
        setDropdownCategoriesOpen(false);
    };

    const handleCategoriesDropdownChange = (event: SelectChangeEvent<typeof filterBySite>) => {
        const {
            target: {value},
        } = event;
        setFilterByCategory(
            typeof value === 'string' ? value.split(',') : value,
        );
        setSelectedFilters(filters => {
            filters.categories = typeof value === 'string' ? value.split(',') : value;
            return filters;
        })
        fetchResults()
    };

    const handleSiteSelectionDelete = (siteSlug) => () => {
        setFilterBySite((value) => {
            value = value.filter(v => v !== siteSlug);
            return value;
        });
        setSelectedFilters(filters => {
            filters.sites = filters.sites.filter(site => site !== siteSlug);
            return filters;
        })
        fetchResults();
    };

    const handleCategorySelectionDelete = (categorySlug) => () => {
        setFilterByCategory((value) => {
            value = value.filter(v => v !== categorySlug);
            return value;
        });
        setSelectedFilters(filters => {
            filters.categories = filters.categories.filter(category => category !== categorySlug);
            return filters;
        })
        fetchResults();
    };

    return (<section id='filter-bar'>
        <div className='top'>
            <span>Here are some Automations that pre-defined for product availability monitoring</span>
            <Button variant="text" color='secondary' onClick={resetAll}>See All</Button>
        </div>
        <Stack direction="row" spacing={1}>
            <Chip variant='outlined' icon={<ImportExportIcon fontSize="small" />} label='Extract Data' className={selectedFilters.keywords.includes('extract') ? 'selected' : ''} onClick={() => toggleChip('extract')} />
            <Chip variant='outlined' icon={<MonitorIcon fontSize="small" />} label='Monitoring' className={selectedFilters.keywords.includes('monitor') ? 'selected' : ''} onClick={() => toggleChip('monitor')} />
            {selectedFilters.sites.map((siteSlug) => {
                return (
                    <ListItem disableGutters key={siteSlug} >
                        <Chip
                            label={siteSlug}
                            onDelete={handleSiteSelectionDelete(siteSlug)}
                        />
                    </ListItem>
                );
            })}
            <div className='dropdown-chip-container'>
                <Chip variant='outlined' icon={<AddIcon />} label='Filter by Site' onClick={openDropdownSites} />
                <FormControl sx={{ m: 1, width: 300 }} size="small">
                    <Select
                        multiple
                        value={filterBySite}
                        open={dropdownSitesOpen}
                        onClose={closeDropdownSites}
                        onOpen={openDropdownSites}
                        onChange={handleSitesDropdownChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {siteOptions.map((site: { title: string, slug: string }) => (
                            <MenuItem key={site.slug} value={site.slug}>
                                <Checkbox checked={filterBySite.indexOf(site.slug) > -1} />
                                <ListItemText primary={site.title} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            {selectedFilters.categories.map((categorySlug) => {
                return (
                    <ListItem disableGutters key={categorySlug} >
                        <Chip
                            label={categorySlug}
                            onDelete={handleCategorySelectionDelete(categorySlug)}
                        />
                    </ListItem>
                );
            })}
            <div className='dropdown-chip-container'>
                <Chip variant='outlined' icon={<AddIcon />} label='Filter by Categorie' onClick={openDropdownCategories}/>
                <FormControl sx={{ m: 1, width: 300 }} size="small">
                    <Select
                        multiple
                        value={filterByCategory}
                        open={dropdownCategoriesOpen}
                        onClose={closeDropdownCategories}
                        onOpen={openDropdownCategories}
                        onChange={handleCategoriesDropdownChange}
                        input={<OutlinedInput label="Tag" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {categoryOptions.map((category: { title: string, slug: string }) => (
                            <MenuItem key={category.slug} value={category.slug}>
                                <Checkbox checked={filterByCategory.indexOf(category.slug) > -1} />
                                <ListItemText primary={category.title} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </Stack>
    </section>);
}
