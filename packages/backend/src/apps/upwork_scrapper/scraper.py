import requests
import bs4
import json
import sys
import os
import hashlib
import time
# Headers to fake the request as a browser to avoid blocking
with open("/Users/youssefmohamed/Documents/Bitbucket/Rss/packages/backend/src/apps/upwork_scrapper/headers.json") as file:
    headers = json.load(file)

def sanitize_filename(input_url):
    # Replace characters that are not allowed in filenames
    return input_url.replace('/', '_').replace(':', '_').replace('?', '_').replace('&', '_').replace('=', '_')

def scrape_data(call_flag):
    if len(sys.argv) > 1:
        input_url = sys.argv[1]
   

    url = requests.get(input_url, headers=headers)  
    parser = bs4.BeautifulSoup(url.content, 'lxml')

    # List to hold job data
    job_listings = []

    # Iterate over each job element
    for job in parser.find_all('article', class_='job-tile'):
        title_tag = job.find('h2', class_='job-tile-title')
        url_tag = job.find('a', href=True)
        description_tag = job.find('p', class_='mb-0 text-body-sm')
        date_element = job.find('small', {'data-test': 'job-pubilshed-date'})
        estimate_desc = job.find('ul', {'class': 'job-tile-info-list'})

        if title_tag and url_tag and description_tag and date_element:
            title = title_tag.text.strip()
            publish_date = date_element.text.strip() 
            url = url_tag['href']
            job_type = estimate_desc.find('li', {'data-test': 'job-type-label'}).text.strip() if estimate_desc.find('li', {'data-test': 'job-type-label'}) else ''
            experience_level = estimate_desc.find('li', {'data-test': 'experience-level'}).text.strip() if estimate_desc.find('li', {'data-test': 'experience-level'}) else ''
            is_fixed_price = estimate_desc.find('li', {'data-test': 'is-fixed-price'}).text.strip() if estimate_desc.find('li', {'data-test': 'is-fixed-price'}) else ''
            duration = estimate_desc.find('li', {'data-test': 'duration-label'}).text.strip() if estimate_desc.find('li', {'data-test': 'duration-label'}) else ''

            if url.endswith('/?referrer_url_path=/nx/search/jobs'):
                full_url = "https://www.upwork.com" + url
                description = description_tag.text.strip()
                
                job_listings.append({
                    'title': title,
                    'link': full_url,
                    'description': description,
                    'publish_date': publish_date,
                    'estimate_desc': job_type + '-' + experience_level + '-' + duration + '-' + is_fixed_price
                })

    # print(job_listings)
    if not job_listings:  # Check if job_listings is empty
        print("No job listings found. Sleeping for 2 minutes...")
        if call_flag:
            time.sleep(60)  # Sleep for 2 minutes (120 seconds)
            scrape_data(False) 
    else:
        sanitize_file = sanitize_filename(input_url)
        result_file_path = f'/Users/youssefmohamed/Documents/Bitbucket/Rss/packages/backend/src/apps/upwork_scrapper/result_files/{sanitize_file}.json'
        
        # result_file_path = '/Users/youssefmohamed/Documents/Bitbucket/Rss/packages/backend/src/apps/upwork_scrapper/result_files/{input_url}.json'

        # Ensure the directory exists before creating the file
        os.makedirs(os.path.dirname(result_file_path), exist_ok=True)

        # Check if the file exists
        if not os.path.exists(result_file_path):
            try:
                # Create the file if it does not exist
                with open(result_file_path, 'w') as outfile:
                    outfile.write('[]')  # Initialize with an empty list
                print("File created successfully.")
            except IOError as e:
                print(f"File Creation Error: {e}")
                return []

        # Save the job listings to result.json
        try:
            with open(result_file_path, 'w') as outfile:
                json.dump(job_listings, outfile, indent=4)
            print("Data written successfully.")
        except IOError as e:
            print(f"File Write Error: {e}")
            return []

        # Output the job listings as JSON (for PythonShell to capture)
        print(json.dumps(job_listings))

        return job_listings
                
def run_scrape():
    return scrape_data(True)

if __name__ == "__main__":
    run_scrape()
