-- First, let's see what we have in incomplete assessments with full responses
SELECT 
    email,
    demographic_data::json->>'firstName' as first_name,
    demographic_data::json->>'lastName' as last_name,
    LENGTH(responses::text) as response_length
FROM assessment_progress 
WHERE completed = false
ORDER BY LENGTH(responses::text) DESC;
