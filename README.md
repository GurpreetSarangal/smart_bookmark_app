# Smart Bookmark App

## Tech Stack
- Next.js
- Supabase
- tailwind.css

## Challenges and Solutions

1. callback after successful login:  
    problem -
    - it kept redirecting back to /login even after successful login through gmail. 
    
    analysed reason- 
    
    - in line `const supabase =  createClient();` I was missing `await` because `createClient()` is an `async` function

    how i solved it-
    
    - using `await` before calling `createClient()` to wait the execution until a browser client is created using supabase public URL and supabase anon key.

2. Realtime change  
    problem -
      
    - initialy I implemented the functionalities without realtime updates. 
    - but I had to reload the page every time if I made any changes. 
    - so i tried creating triggers on every row of table `bookmark`. it didn't worked. I still had to reload the page.

    my analysis - 
    
    - i had to enable `Database > Publications > Supabase Realtime > Bookmarks`. 

    my solution - 
    
    - i did enabled this option.
    - then i implemented a channel to subscribe to the changes in the table. and update the whole list in event of any change
    
    future enhancements- 
    
    - I can implement an optimized approach ie instead of updating whole list.
    - I can only fetch the changed part - in case of edit(which is not yet a part)
    - I can simply remove one from list - in case of deletion.
    - I could just add a row

3. Google Redirects to `localhost:3000` on supabase.  
    problem -
    
    - everything works great until you login.
    - after successfuly authenticating using google. It redirected me to localhost:3000 even on supabase.

    my thought process - 

    - turns out, since i have used the starter code of supabase, they had an enviroment variable for supabase url.
    - which if not present, it by default redirects to `localhost:3000`.
    - so i added the environment variable. `VERCEL_URL=smart-bookmark-app-ten-drab.vercel.app/`
    - but even after this, supabase still redirected to `localhost:3000`
    - after researching for sometime, I found that under `Authentication > URL Configuarations > Site URLs and Redirect URLs` was real problem.
    - there was localhost:3000 and site's URL which kept redirecting it back to localhost.
    - so I changed the site url to vercel's 
    - and changed the redirect url to `https://smart-bookmark-app-ten-drab.vercel.app/auth/callback` so that after authentication google page redirects to `auth/callback` 
    - which leads it to `/protected` page.

PS: I use Conventional Commits to keep my git history cleaner.