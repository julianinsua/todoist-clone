import React from "react";
import { 
    FaChevronDown, 
    FaInbox, 
    FaRegCalendarAlt, 
    FaRegCalendar 
} from "react-icons/fa";

export const Sidebar = ()=>(
    <div className="sidebar" data-testid="sidebar">
        <ul className="sidebar__generic">
            <li><span><FaInbox /></span><span>Inbox</span></li>
            <li>Today</li>
            <li>Next 7 days</li>
        </ul>
    </div>
    );