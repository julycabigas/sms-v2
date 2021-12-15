import React from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery } from 'hooks'

export default function Links({ current, totalPages }) {
  const pages =  pagination(current, totalPages);
  const query = useQuery();

  const _pages = pages && pages.map(page => {
    query.set('page', page);
    const queries = query.toString();
    return {
      url: page === '...' ? '...'  : `?${queries}`,
      page,
    }
  });

  return (
    <ul className="pagination">
      {_pages && _pages.map((item, key) => (
        <React.Fragment key={key}>
          {item.url === '...' ? (
            <li className="page-item">
              <button className="page-link">
                <span aria-hidden="true">…</span>
                <span className="sr-only">More</span>
              </button>
            </li>
          ) : (
            <li className="page-item">
              <NavLink role="button"
                className="page-link"
                activeClassName={`${current === item.page  ? 'active' : ''}`}
                to={item.url}
              >{item.page}</NavLink>
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
}

// code ref https://gist.github.com/kottenator/9d936eb3e4e3c3e02598

function pagination(c, m) {
  var current = c,
    last = m,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;
  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || i >= left && i < right) {
      range.push(i);
    }
  }
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}
