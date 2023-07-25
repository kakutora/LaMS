export const createTableQuery = `CREATE TABLE IF NOT EXISTS images (
  id int(11) NOT NULL AUTO_INCREMENT,
  title text NOT NULL,
  time timestamp NOT NULL DEFAULT current_timestamp(),
  image_path text NOT NULL,
  PRIMARY KEY (id)
)`;