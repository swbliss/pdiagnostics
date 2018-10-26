from flask import Flask, render_template, send_from_directory, url_for
import os
import json


#################### GLOBAL ####################
app = Flask(__name__)

@app.route('/test')
def test():
	return render_template('starter.html')


############### TAB:imagemanager ###############
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


@app.route('/imagemanager')
def image_manager():
	return render_template('imagemanager.html')

@app.route('/delete_img/<filename>/', methods=['GET', 'POST'])
def delete_img(filename):
	return move_img(filename, True)

@app.route('/add_img/<filename>/', methods=['GET', 'POST'])
def add_img(filename):
	return move_img(filename, False)


########### TAB:trainingsetmanager #############
def trainingset_info():
	prefix = 'static/data/training/'
	res = {}	# trainingset:images(array)

	sets = os.listdir(prefix)
	for trainingset in sets:
		res[trainingset] = []
		for f in os.listdir(prefix + trainingset):
			if f[-8:] == "meta.txt":
				toks = open(prefix + trainingset + '/' + f)\
						.readline().strip().split(',')
				toks.insert(0, f.split('.')[0])
				res[trainingset].append(toks)
	return res
	
@app.route('/trainingsetmanager')
def trainingset_manager():
	return render_template('trainingsetmanager.html')

@app.route('/trainingset', methods=['GET'])
def trainingset():
	return json.dumps(trainingset_info())



########### TAB:diagnostics #############
@app.route('/diagnostics')
def diagnostics():
	return render_template('diagnostics.html')

@app.route('/trainingset_list')
def trainingset_list():
	return json.dumps(trainingset_info().keys())


########### TAB:prognostics #############
@app.route('/prognostics')
def prognostics():
	return render_template('prognostics.html')


if __name__ == "__main__":
	app.run(host='0.0.0.0', port=9021, debug=True)
