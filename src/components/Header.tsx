import { HugeiconsIcon } from '@hugeicons/react';

import {Search01Icon, Moon02Icon} from "@hugeicons/core-free-icons";

export const Header = () => {
  return (
    <header className='header'>
        <div className='logo'>
            <h2>The Weather App</h2>
        </div>
        <div className='searchBox'>
            <HugeiconsIcon icon= {Search01Icon}/>
            <input type="text" placeholder="Search city..."/>
        </div>

        <div>
            <button className="themBtn">
            <HugeiconsIcon icon = {Moon02Icon}/>
            </button>
        </div>

    </header>
    
  )
}
