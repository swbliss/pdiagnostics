from flask import Flask, render_template, send_from_directory, url_for
import os


# If to_new is true, it means deleting (ori->new)
def move_img(filename, to_new):
	data_dir = os.path.dirname(os.path.realpath(__file__)) + '/static/data/'
	
	src_dir = 'image_ori/' if to_new else 'image_new/'
	dst_dir = 'image_new/' if to_new else 'image_ori/'
	
	img_file = data_dir + src_dir + filename + '.jpg'
	meta_file = data_dir + src_dir + filename + '.meta.txt'

	if os.path.isfile(img_file):
		os.rename(img_file, data_dir + dst_dir + filename + '.jpg')
		os.rename(meta_file, data_dir + dst_dir + filename + '.meta.txt')
		
		src_list = open(data_dir + src_dir + 'list.txt').readlines()
		src_list.remove(filename + '\n')
		with open(data_dir + src_dir + 'list.txt', 'w') as f:
			f.write(''.join(src_list))

		dst_list = []
		if os.path.isfile(data_dir + dst_dir + 'list.txt'):
			dst_list = open(data_dir + dst_dir + 'list.txt').readlines()
		dst_list.append(filename + '\n')
		with open(data_dir + dst_dir + 'list.txt', 'w') as f:
			f.write(''.join(dst_list))
	return ''


app = Flask(__name__)

@app.route('/image-manager')
def image_manager():
	return render_template('imagemanager.html')

@app.route('/delete_img/<filename>/', methods=['GET', 'POST'])
def delete_img(filename):
	return move_img(filename, True)

@app.route('/add_img/<filename>/', methods=['GET', 'POST'])
def add_img(filename):
	return move_img(filename, False)


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=9021, debug=True)
