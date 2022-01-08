import { signInWithGoogle, signOut, useUserState } from './firebase.js';

const days = ['M', 'Tu', 'W', 'Th', 'F'];
export const terms = { F: 'Fall', W: 'Winter', S: 'Spring'};

export const getCourseNumber = course => (
    course.id.slice(1, 4)
);

const TermButton = ({term, setTerm, checked}) => (
    <>
      <input type="radio" id={term} className="btn-check" checked={checked} autoComplete="off"
        onChange={() => setTerm(term)} />
      <label class="btn btn-success m-1 p-2" htmlFor={term}>
      { term }
      </label>
    </>
);

const SignInButton = () => (
    <button className="btn btn-secondary btn-sm"
        onClick={() => signInWithGoogle()}>
      Sign In
    </button>
);

const SignOutButton = () => (
    <button className="btn btn-secondary btn-sm"
        onClick={() => signOut()}>
      Sign Out
    </button>
);
  
export const TermSelector = ({term, setTerm}) => {
    const [user] = useUserState();
    return (
      <div className="btn-toolbar justify-content-between">
        <div className="btn-group">
        { 
          Object.values(terms).map(
            value => <TermButton key={value} term={value} setTerm={setTerm} checked={value === term} />
          )
        }
        </div>
        { user ? <SignOutButton /> : <SignInButton /> }
      </div>
    );
  };

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

export const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

export const toggle = (x, lst) => (
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

export const getCourseTerm = course => (
  terms[course.id.charAt(0)]
);

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start) < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
    getCourseTerm(course1) === getCourseTerm(course2)
    && timeConflict(course1, course2)
);

export const hasConflict = (course, selected) => (
    selected.some(selection => courseConflict(course, selection))
);
