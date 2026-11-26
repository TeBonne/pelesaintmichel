-- Replace a list atomically: delete all rows, then insert new rows, in a single transaction
-- Ensures that if insert fails, delete is rolled back (list remains intact, not empty)
create or replace function replace_list(
  table_name text,
  rows jsonb
) returns void language plpgsql security definer as $$
declare
  r jsonb;
begin
  -- Delete all existing rows
  execute format('delete from %I where id != %L', table_name, '00000000-0000-0000-0000-000000000000'::uuid);

  -- Insert new rows
  if jsonb_array_length(rows) > 0 then
    for r in select * from jsonb_array_elements(rows)
    loop
      execute format('insert into %I values ($1.*)', table_name) using r;
    end loop;
  end if;
end;
$$;
