# -*- coding: utf-8 -*-
def AlgorithmTraining():
    from data_preprocessing import PreprocessData
    from sklearn.model_selection import train_test_split, cross_validate, learning_curve
    from sklearn.linear_model import Ridge
    import numpy as np
    
    transmit_bitrate_dataset_X, transmit_bitrate_dataset_y, receive_bitrate_dataset_X, receive_bitrate_dataset_y = PreprocessData()
    
    regularization_param_list = [float(0),float(0.01)]
    for i in range(0,20):
        regularization_param_list.append(float(regularization_param_list[len(regularization_param_list)-1]*2))
    
    #train and test dataset for predicting mean_txInOctets
    X_train_in, X_test_in, y_train_in, y_test_in = train_test_split(receive_bitrate_dataset_X,receive_bitrate_dataset_y,test_size=0.33)
    
    #train and test dataset for predicting mean_txOutOctets
    X_train_out, X_test_out, y_train_out, y_test_out = train_test_split(transmit_bitrate_dataset_X, transmit_bitrate_dataset_y,test_size=0.33)
    
    #reshaping X_train_in
    #X_train_in.shape = (X_train_in.shape[0],1)
    
    #reshaping X_train_out
    #X_train_out.shape = (X_train_out.shape[0],1)
    
    #models list for transmit_bitrate_dataset
    models_list_transmit = list()   
    
    #models list for receive_bitrate_dataset
    models_list_receive = list()  
    
    for i in regularization_param_list:
        training_algorithm_for_receive = Ridge(alpha=i,normalize=True)
        #training the algorithm for receive bitrate
        cross_validate_dict = cross_validate(training_algorithm_for_receive,X_train_in,y_train_in,return_estimator = True)
        #returning estimator with the best cross validation set score
        training_algorithm_for_receive = cross_validate_dict['estimator'][np.argmax(cross_validate_dict['test_score'])]
        models_list_receive.append(training_algorithm_for_receive)
        
        training_algorithm_for_transmit = Ridge(alpha=i,normalize=True)
        #training the algorithm for transmit bitrate
        cross_validate_dict = cross_validate(training_algorithm_for_transmit,X_train_out,y_train_out,return_estimator = True)
        #returning estimator with the best cross validation set score
        training_algorithm_for_transmit = cross_validate_dict['estimator'][np.argmax(cross_validate_dict['test_score'])]
        models_list_transmit.append(training_algorithm_for_transmit)
    
    temp_list = list()
    for i in range(0,len(models_list_receive)):
       temp_list.append(models_list_receive[i].score(X_test_in,y_test_in))
    
    best_model_receive = models_list_receive[temp_list.index(max(temp_list))]
    
    temp_list = []
    for i in range(0,len(models_list_transmit)):
        temp_list.append(models_list_transmit[i].score(X_test_out,y_test_out))
    
    best_model_transmit = models_list_transmit[temp_list.index(max(temp_list))]
    
    print(best_model_receive.score(X_test_in,y_test_in))
    print(best_model_transmit.score(X_test_out,y_test_out))
                                                     
    return best_model_receive, best_model_transmit
